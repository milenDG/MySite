namespace MySite
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.ResponseCompression;
    using System.IO.Compression;
    using System.Linq;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Rewrite;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Net.Http.Headers;

    public class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry();

            services.AddMvc(options =>
            {
                options.CacheProfiles.Add("Default30",
                new CacheProfile()
                {
                    Duration = 86400
                });
            }).SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            services.Configure<GzipCompressionProviderOptions>(options => {
                options.Level = CompressionLevel.Fastest;
            });

            services.AddResponseCompression(options => {
                options.Providers.Add<BrotliCompressionProvider>();
                options.EnableForHttps = true;
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] {
                    "application/xhtml+xml",
                    "application/atom+xml",
                    "image/svg+xml",
                });
            });

            services.AddMvc(option => option.EnableEndpointRouting = false);
        }

        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error/500");
                app.UseHsts();
                //app.UseRewriter(new RewriteOptions().AddRedirectToHttps(StatusCodes.Status301MovedPermanently, 443));
            }

            var rewrite = new RewriteOptions()
                .AddIISUrlRewrite(env?.ContentRootFileProvider, "web.config");

            app.UseRewriter(rewrite);

            app.Use(async (ctx, next) =>
            {
                await next().ConfigureAwait(false);

                if (ctx.Response.StatusCode == 404 && !ctx.Response.HasStarted)
                {
                    //Re-execute the request so the user gets the error page
                    string originalPath = ctx.Request.Path.Value;
                    ctx.Items["originalPath"] = originalPath;
                    ctx.Request.Path = "/error/404";
                    await next().ConfigureAwait(false);
                }
            });

            app.UseResponseCompression();

            app.UseMvc(routes =>
              {
                  routes.MapRoute(
                      name: "default",
                      template: "{controller=Home}/{action=Index}/{id?}");
              });

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    const int durationInSeconds = 7 * 60 * 60 * 24;
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                        "public,max-age=" + durationInSeconds;
                }
            });

        }
    }
}
