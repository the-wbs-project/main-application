using Auth0.ManagementApi.Models;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.Services.Transformers;
using Wbs.Core.ViewModels;

namespace Wbs.Core.DataServices;

public class UserDataService : BaseAuthDataService
{
    public UserDataService(ILoggerFactory loggerFactory, IAuth0Config config) : base(loggerFactory.CreateLogger<UserDataService>(), config) { }

    public async Task<User[]> GetUsersAsync(IEnumerable<string> userIds)
    {
        var client = await GetClientAsync();
        var results = new List<User>();
        var queries = new List<string>();

        foreach (var id in userIds)
        {
            queries.Add($"user_id:\"{id}\"");

            if (queries.Count == 15)
            {
                var pageResults = await client.Users.GetAllAsync(new GetUsersRequest
                {
                    Query = string.Join(" OR ", queries.ToArray())
                });

                results.AddRange(pageResults);
                queries.Clear();
            }
        }
        if (queries.Count > 0)
        {
            var pageResults = await client.Users.GetAllAsync(new GetUsersRequest
            {
                Query = string.Join(" OR ", queries.ToArray()),
                Fields = "created_at,user_id,name,picture,last_login,email,email_verified,logins_count,updated_at,app_metadata,user_metadata"
            });

            results.AddRange(pageResults);
        }

        return results.ToArray();
    }

    public async Task<User> GetAsync(string userId)
    {
        var client = await GetClientAsync();

        return await client.Users.GetAsync(userId);
    }

    public async Task<Member> GetMemberAsync(string userId)
    {
        return new Member(await GetAsync(userId));
    }

    public async Task UpdateAsync(UserViewModel user)
    {
        var client = await GetClientAsync();

        await client.Users.UpdateAsync(user.UserId, UserTransformer.ToUpdateUserRequest(user));
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
            calls.Add(GetMemberAsync(userId));

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