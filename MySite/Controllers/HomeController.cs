namespace MySite.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    public class HomeController : Controller
    {
        public const string ViewTitle = "Milen Georgiev - Software Engineer";

        [Route("")]
        public IActionResult Index()
        {
            return this.View();
        }

        [Route("Home")]
        [Route("Index")]
        [Route("Home/Index")]
        [Route("index.html")]
        public IActionResult Slash()
        {
            return this.Redirect("/");
        }
    }
}
