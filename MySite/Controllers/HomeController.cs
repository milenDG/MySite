namespace MySite.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    public class HomeController : Controller
    {
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
