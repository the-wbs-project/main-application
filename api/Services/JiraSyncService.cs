using Wbs.Api.Models;

namespace Wbs.Api.Services;

public class JiraSyncService
{
    private readonly ILogger<JiraSyncService> logger;
    private readonly JiraHelpDeskDataService jira;
    private readonly OrganizationDataService auth0;

    public JiraSyncService(ILogger<JiraSyncService> logger, JiraHelpDeskDataService jira, OrganizationDataService auth0)
    {
        this.logger = logger;
        this.jira = jira;
        this.auth0 = auth0;
    }

    public async Task SyncCustomers()
    {
        var metadataid = "jiraOrganizationId";
        var desks = await jira.GetServiceDesksAsync();
        var auth0Orgs = await auth0.GetOrganizationsAsync();
        var jiraOrgs = await jira.GetOrganizationsAsync();
        //
        //  First let's make sure all organizations are synced
        //
        foreach (var authOrg in auth0Orgs)
        {
            var jiraId = authOrg.Metadata.ContainsKey(metadataid) ? authOrg.Metadata[metadataid] : null;

            if (jiraId == null)
            {
                logger.LogInformation($"Creating organization {authOrg.Name}");

                var jiraOrgId = await jira.CreateOrganizationAsync(authOrg.Name);

                authOrg.Metadata.Add("jiraOrganizationId", jiraOrgId);

                await auth0.UpdateOrganizationAsync(authOrg);

                jiraOrgs.Add(new JiraOrganization { id = jiraOrgId, name = authOrg.Name });
            }
        }
        //
        //  Now let's make sure all users are synced
        //
        foreach (var authOrg in auth0Orgs)
        {
            string jiraOrgId = authOrg.Metadata[metadataid];

            var authMembers = await auth0.GetOrganizationalUsersAsync(authOrg.Id);
            var jiraMembers = await jira.GetCustomersAsync(jiraOrgId);

            foreach (var authMember in authMembers)
            {
                var jiraMember = jiraMembers.FirstOrDefault(m => m.emailAddress == authMember.Email);

                if (jiraMember == null)
                {
                    logger.LogInformation($"Creating user {authMember.Email}");

                    var jiraId = await jira.CreateCustomerAsync(authMember.Email, authMember.Name);

                    await jira.AddUsersToOrganizationAsync(jiraOrgId, jiraId);
                }
            }
        }
        //
        //  Now let's make sure all organizations are with each service desk
        //
        foreach (var desk in desks)
        {
            var orgIds = await jira.GetOrganizationsInServiceDeskAsync(desk.id);

            foreach (var jiraOrg in jiraOrgs)
            {
                if (orgIds.Contains(jiraOrg.id)) return;

                logger.LogInformation($"Adding organization {jiraOrg.name} to service desk {desk.id}");

                await jira.AddOrganizationToServiceDeskAsync(desk.id, jiraOrg.id);
            }
        }
    }
}
