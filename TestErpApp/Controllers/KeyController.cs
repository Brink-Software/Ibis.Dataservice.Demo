using Microsoft.AspNetCore.Mvc;

namespace TestErpApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KeyController : ControllerBase
    {
        private readonly IServiceProvider _services;
        public KeyController(IServiceProvider services)
        {
            _services = services;
        }

        [HttpGet]
        public KeyModel Get()
        {
            var store = _services.GetService<KeyStore>();
            return new KeyModel
            {
                Key = store.Key
            };
        }

        [HttpPost]
        public ActionResult Set([FromBody] KeyModel key)
        {
            var store = _services.GetService<KeyStore>();
            store.Key = key.Key;

            return new OkResult();
        }
    }

    public class KeyModel
    {
        public string Key { get; set; }
    }
}