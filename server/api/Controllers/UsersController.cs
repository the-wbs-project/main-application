using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wbs.Core.DataServices;
using Wbs.Core.Services.Transformers;
using Wbs.Core.ViewModels;

namespace Wbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger logger;
    private readonly DataServiceFactory data;

    public UsersController(ILoggerFactory loggerFactory, DataServiceFactory data)
    {
        logger = loggerFactory.CreateLogger<UsersController>();
        this.data = data;
    }

    [Authorize]
    [HttpGet("byIds/{userIds}")]
    public async Task<IActionResult> GetUser(string userIds)
    {
        try
        {
            var userIdList = userIds.Split(',');
            var list = await data.Users.GetUsersAsync(userIdList);
            return Ok(UserTransformer.ToViewModelList(list));
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            logger.LogError(ex, "Error updating users");
            return new StatusCodeResult(500);
        }
    }

    [Authorize]
    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateUser(string userId, UserViewModel user)
    {
        try
        {
            if (user.UserId != userId) return BadRequest("The User Id in the URL doesn't match the value in the body>");

            await data.Users.UpdateAsync(user);

            return Accepted();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating user {userId}", userId);
            return new StatusCodeResult(500);
        }
    }

}

