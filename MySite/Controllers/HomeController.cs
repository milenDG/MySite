namespace MySite.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    public class HomeController : Controller
    {
        public const string ViewTitle = "Milen Georgiev - Software Engineer";

        [HttpGet("/")]
        public IActionResult Index()
        {
            return this.View();
        }

        [HttpGet("/Index")]
        [HttpGet("index.html")]
        [HttpGet("/Home")]
        [HttpGet("/Home/Index")]
        public IActionResult NotSlash()
        {
            return this.Redirect("/");
        }
    }
}
