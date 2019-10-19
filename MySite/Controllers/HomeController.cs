namespace MySite.Controllers
{
    using System;
    using Microsoft.AspNetCore.Mvc;

    public class HomeController : Controller
    {
        public const string ViewTitle = "Milen Georgiev - Software Engineer";

        public IActionResult Index()
        {
            return this.View();
        }
    }
}
