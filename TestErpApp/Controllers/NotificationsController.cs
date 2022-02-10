using Microsoft.AspNetCore.Mvc;

namespace TestErpApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly IServiceProvider _services;
        public NotificationsController(IServiceProvider services)
        {
            _services = services;
        }

        [HttpGet]
        public IEnumerable<NotificationModel> Get()
        {
            var store = _services.GetService<NotificationStore>();
            return store.Get();
        }

        [HttpPost]
        public ActionResult Notify([FromBody]NotificationModel content)
        {
            var store = _services.GetService<NotificationStore>();
            store.Add(content);
            return new OkResult();
        }
    }

    public class NotificationModel
    {
        public string CompanyId
        {
            get;
            set;
        }

        public string FileId
        {
            get;
            set;
        }

        public string FileVersion
        {
            get;
            set;
        }

        public string ApplicationName
        {
            get;
            set;
        }

        public string DataUrl
        {
            get;
            set;
        }

        public string EntityStatus
        {
            get;
            set;
        }

        public string Token
        {
            get;
            set;
        }
    }
}