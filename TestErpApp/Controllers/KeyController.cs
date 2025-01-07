namespace TestErpApp.Controllers;

[ApiController]
[Route("[controller]")]
public class KeyController(IServiceProvider services) : ControllerBase
{
    private readonly IServiceProvider _services = services;

    [HttpGet]
    public KeyModel Get()
    {
        var store = _services.GetService<KeyStore>();
        return new KeyModel(store?.Key ?? string.Empty);
    }

    [HttpPost]
    public ActionResult Set([FromBody] KeyModel key)
    {
        var store = _services.GetService<KeyStore>();
        store!.Key = key.Key;

        return new OkResult();
    }
}

public record KeyModel(string Key);
