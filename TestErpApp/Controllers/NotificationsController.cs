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
#pragma warning disable IDE1006 // Naming Styles, due to external API
public record NotificationModel(Guid? FileId, string? FileVersion, string? ApplicationName, Uri? DataUrl, string? Token, Dictionary<string, string>? customProperties);
