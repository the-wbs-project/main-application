using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;

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

        var orgs = await client.Users.GetAllOrganizationsAsync(userId, page);

        foreach (var org in orgs)
        {
            if (org.Metadata == null) org.Metadata = new Dictionary<string, object>();
        }
        return orgs;
    }

    public async Task UpdateProfileAsync(Member user)
    {
        var client = await GetClientAsync();

        await client.Users.UpdateAsync(user.Id, new UserUpdateRequest
        {
            FullName = user.Name
        });
    }


    public async Task<Dictionary<string, UserDocument>> GetUserDocumentsAsync(IEnumerable<string> userIds, Dictionary<string, UserDocument> userCache = null)
    {
        var users = new Dictionary<string, UserDocument>();
        var calls = new List<Task<Member>>();

        foreach (var userId in userIds)
        {
            if (userCache != null && userCache.ContainsKey(userId))
            {
                users.Add(userId, userCache[userId]);
                continue;
            }
            calls.Add(GetUserAsync(userId));

            if (calls.Count == 25)
            {
                var results = await Task.WhenAll(calls);

                foreach (var result in results)
                {
                    var model = new UserDocument(result.Id, result.Name);
                    users.Add(result.Id, model);

                    if (userCache != null) userCache.Add(result.Id, model);
                }
                calls.Clear();
            }
        }
        if (calls.Count > 0)
        {
            var results = await Task.WhenAll(calls);

            foreach (var result in results)
            {
                var model = new UserDocument(result.Id, result.Name);
                users.Add(result.Id, model);

                if (userCache != null) userCache.Add(result.Id, model);
            }
        }

        return users;
    }


}