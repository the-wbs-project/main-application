
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services;

public class CloudflareKvService
{
    private readonly ILogger logger;
    private readonly CloudflareApiService api;

    public CloudflareKvService(ILoggerFactory loggerFactory, CloudflareApiService api)
    {
        this.api = api;
        logger = loggerFactory.CreateLogger<CloudflareKvService>();
    }

    public async Task SetOrganizationUsersAsync(string organization, List<UserViewModel> users)
    {
        var key = string.Join('|', "ORGS", organization, "USERS");

        await api.SetKvNamespaceValueAsync(key, users);
    }

    public async Task SetOrganizationUserAsync(string organization, string visibility, UserViewModel user)
    {
        var key = string.Join('|', "ORGS", organization, "USERS", user.UserId, visibility);

        await api.SetKvNamespaceValueAsync(key, user);
    }
}