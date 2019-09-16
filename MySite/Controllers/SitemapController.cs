namespace MySite.Controllers
{
    using System.Xml;
    using Microsoft.AspNetCore.Mvc;

    public class SitemapController : Controller
    {
        [Route("/sitemap.xml")]
        public void SitemapXml()
        {
            string host = this.Request.Scheme + "://" + this.Request.Host;

            this.Response.ContentType = "application/xml";

            using (var xml = XmlWriter.Create(this.Response.Body, new XmlWriterSettings { Indent = true }))
            {
                xml.WriteStartDocument();
                xml.WriteStartElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9");

                xml.WriteStartElement("url");
                xml.WriteElementString("loc", host);
                xml.WriteEndElement();

                xml.WriteEndElement();
            }
        }
    }
}
