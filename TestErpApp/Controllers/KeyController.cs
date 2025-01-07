namespace TestErpApp.Controllers;

[ApiController]
[Route("[controller]")]
public class KeyController(IServiceProvider services) : ControllerBase
{
    [HttpGet]
    public KeyModel Get()
    {
        var store = services.GetService<KeyStore>();
        return new KeyModel(store?.Key ?? string.Empty);
    }

    [HttpPost]
    public ActionResult Set([FromBody] KeyModel key)
    {
        var store = services.GetService<KeyStore>();
        store!.Key = key.Key;

        return new OkResult();
    }
}

public record KeyModel(string Key);
