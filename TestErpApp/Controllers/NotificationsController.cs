namespace TestErpApp.Controllers;

[ApiController]
[Route("[controller]")]
public class NotificationsController(IServiceProvider services) : ControllerBase
{
    private readonly IServiceProvider _services = services;

    [HttpGet]
    public IEnumerable<NotificationModel> Get()
    {
        var store = _services.GetService<NotificationStore>();
        return store?.Get() ?? [];
    }

    [HttpDelete]
    public ActionResult Delete()
    {
        var store = _services.GetService<NotificationStore>();
        store?.Clear();
        return new OkResult();
    }

    [HttpPost]
    public ActionResult Notify([FromBody] NotificationModel content)
    {
        var store = _services.GetService<NotificationStore>();
        store?.Add(content);
        return new OkResult();
    }
}

public class NotificationModel
{
    public Guid? FileId { get; set; }
    public string? FileVersion { get; set; }
    public string? ApplicationName { get; set; }
    public Uri? DataUrl { get; set; }
    public string? Token { get; set; }
#pragma warning disable IDE1006 // Naming Styles, due to external API
    public Dictionary<string, string>? customProperties { get; set; }
#pragma warning restore IDE1006 // Naming Styles
}
