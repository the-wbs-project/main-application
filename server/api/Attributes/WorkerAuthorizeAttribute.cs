using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Wbs.Api.Attributes;

public sealed class WorkerAuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (context == null)
        {
            context.Result = new StatusCodeResult(500);
        }
        else
        {
            var config = context.HttpContext.RequestServices.GetService<IConfiguration>();
            var workerKey = config["WorkerAuthKey"];

            var workerAuth = context.HttpContext.Request.Headers["Worker-Auth"].FirstOrDefault();

            if (workerAuth != workerKey)
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}