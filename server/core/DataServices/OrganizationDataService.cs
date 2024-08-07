using Auth0.ManagementApi.Models;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;

namespace Wbs.Core.DataServices;

public class OrganizationDataService : BaseAuthDataService
{
    private readonly ILogger<OrganizationDataService> logger;
    protected Dictionary<string, string> orgIds = new Dictionary<string, string>();

    public OrganizationDataService(ILogger<OrganizationDataService> logger, IAuth0Config config) : base(logger, config)
    {
        this.logger = logger;
    }

    public async Task<Organization> GetOrganizationByNameAsync(string name)
    {
        var client = await GetClientAsync();

        return await client.Organizations.GetByNameAsync(name);
    }

    public async Task<string> GetOrganizationIdByNameAsync(string orgName)
    {
        if (orgIds.ContainsKey(orgName))
            return orgIds[orgName];

        var client = await GetClientAsync();
        var org = await client.Organizations.GetByNameAsync(orgName);

        try
        {
            orgIds.Add(orgName, org.Id);
        }
        catch (ArgumentException) { }

        return org.Id;
    }
}
