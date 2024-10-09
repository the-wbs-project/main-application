using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.Models;
using Wbs.Core.Models.Search;

namespace Wbs.Core.DataServices;

public class UserDataService : BaseAuthDataService
{
    public UserDataService(ILoggerFactory loggerFactory, IAuth0Config config) : base(loggerFactory.CreateLogger<UserDataService>(), config) { }

    public async Task<Member> GetMemberAsync(string userId)
    {
        var client = await GetClientAsync();
        var user = await client.Users.GetAsync(userId);

        return new Member(user);
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