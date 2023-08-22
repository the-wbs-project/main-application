namespace Wbs.Api.Models;

public interface IIdObject
{
    string id { get; set; }
}
public interface IDbObject : IIdObject
{
    string pk { get; }
}
