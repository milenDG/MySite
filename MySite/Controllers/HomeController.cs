namespace MySite.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    public class HomeController : Controller
    {
        [Route("/index.html")]
        public IActionResult Index()
        {
            return this.Content(System.IO.File.ReadAllText("index.html"), "text/html");
        }

        [Route("/")]
        public IActionResult Empty()
        {
            return this.Redirect("/index.html");
        }
    }
}