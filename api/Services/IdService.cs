using shortid;
using shortid.Configuration;

namespace Wbs.Api.Services;
public static class IdService
{
  public static string Create() => ShortId.Generate(new GenerationOptions
  {
    UseSpecialCharacters = false,
    UseNumbers = true,
    Length = 10
  });
}
