namespace MySite.Controllers
{
    using System.Collections.Generic;
    using Microsoft.ApplicationInsights;
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Mvc;

    [Route("error")]
    public class ErrorController : Controller
    {
        private readonly TelemetryClient _telemetryClient;

        public ErrorController(TelemetryClient telemetryClient)
        {
            this._telemetryClient = telemetryClient;
        }

        [Route("500")]
        public IActionResult AppError()
        {
            var exceptionHandlerPathFeature = this.HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            this._telemetryClient.TrackException(exceptionHandlerPathFeature.Error);
            this._telemetryClient.TrackEvent("Error.ServerError", new Dictionary<string, string>
            {
                ["originalPath"] = exceptionHandlerPathFeature.Path,
                ["error"] = exceptionHandlerPathFeature.Error.Message
            });
            return this.View("500");
        }

        [Route("404")]
        public IActionResult PageNotFound()
        {
            string originalPath = "unknown";
            if (this.HttpContext.Items.ContainsKey("originalPath"))
            {
                originalPath = this.HttpContext.Items["originalPath"] as string;
            }

            this._telemetryClient?.TrackEvent("Error.PageNotFound", new Dictionary<string, string>
            {
                ["originalPath"] = originalPath
            });
            return this.View("404");
        }
    }
}