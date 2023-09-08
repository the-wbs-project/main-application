using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

public class UserDataService : BaseAuthDataService
{
    private readonly ILogger<UserDataService> logger;

    public UserDataService(ILogger<UserDataService> logger, IConfiguration config) : base(logger, config)
    {
        this.logger = logger;
    }

    public async Task<User> GetUserAsync(string userId)
    {
        var client = await GetClientAsync();

        return await client.Users.GetAsync(userId);
    }

    public async Task<List<string>> GetRolesAsync(string userId)
    {
        var client = await GetClientAsync();
        var roles = await client.Users.GetRolesAsync(userId);

        return roles.Select(x => x.Name).ToList();
    }

    public async Task<IEnumerable<Organization>> GetUserOrganizationsAsync(string userId)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        return await client.Users.GetAllOrganizationsAsync(userId, page);
    }

    public async Task UpdateProfileAsync(UserLite user)
    {
        var client = await GetClientAsync();

        await client.Users.UpdateAsync(user.Id, new UserUpdateRequest
        {
            FullName = user.Name
        });
    }
}