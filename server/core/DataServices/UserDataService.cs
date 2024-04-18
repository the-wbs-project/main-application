using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models;

namespace Wbs.Core.Services;

public class UserDataService : BaseAuthDataService
{
    public UserDataService(ILogger<UserDataService> logger, IAuth0Config config) : base(logger, config) { }

    public async Task<List<Role>> GetRolesAsync()
    {
        var client = await GetClientAsync();

        return new List<Role>(await client.Roles.GetAllAsync(new GetRolesRequest()));
    }

    public async Task<Member> GetUserAsync(string userId)
    {
        var client = await GetClientAsync();

        return new Member(await client.Users.GetAsync(userId));
    }

    public async Task<List<string>> GetRolesAsync(string userId)
    {
        var client = await GetClientAsync();
        var roles = await client.Users.GetRolesAsync(userId);

        return roles.Select(x => x.Id).ToList();
    }

    public async Task<IEnumerable<Organization>> GetUserOrganizationsAsync(string userId)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        return await client.Users.GetAllOrganizationsAsync(userId, page);
    }

    public async Task UpdateProfileAsync(Member user)
    {
        var client = await GetClientAsync();

        await client.Users.UpdateAsync(user.Id, new UserUpdateRequest
        {
            FullName = user.Name
        });
    }
}