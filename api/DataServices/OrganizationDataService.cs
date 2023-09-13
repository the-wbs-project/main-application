using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using Auth0.ManagementApi.Models;
using Auth0.ManagementApi.Paging;
using Newtonsoft.Json;
using Wbs.Api.Models;

namespace Wbs.Api.Services;

public class OrganizationDataService : BaseAuthDataService
{
    private readonly ILogger<OrganizationDataService> logger;
    protected Dictionary<string, string> orgIds = new Dictionary<string, string>();

    public OrganizationDataService(ILogger<OrganizationDataService> logger, IConfiguration config) : base(logger, config)
    {
        this.logger = logger;
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

    public async Task<IEnumerable<Member>> GetOrganizationalUsersAsync(string organization)
    {
        using (var http = new HttpClient())
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://{config.Domain}/api/v2/organizations/{organization}/members?per_page=100&take=100&fields=user_id"),
            };

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", mgmtToken);

            var response = await http.SendAsync(request);
            var raw = await response.Content.ReadAsStringAsync();

            if (response.StatusCode == HttpStatusCode.OK)
            {
                //
                //  UGLY, and I mean UGLY hack.  But I was nota ble to figure out why the deserialization didn't work.
                //
                var members = JsonConvert.DeserializeObject<MemberIds>(raw);
                var query = $"user_id: ({string.Join(" OR ", members.members.Select(m => $"\"{m.user_id}\"").ToArray())})";

                request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"https://{config.Domain}/api/v2/users?per_page=100&take=100&q={query}"),
                };

                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", mgmtToken);

                response = await http.SendAsync(request);
                raw = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<User[]>(raw).Select(u => new Member(u));
            }
            else
            {
                logger.LogError(response.StatusCode + ": " + raw);

                throw new Exception($"Failed to pull management token: {response.StatusCode}");
            }
        }
    }

    public async Task<IEnumerable<string>> GetUserOrganizationalRolesAsync(string organization, string userId)
    {
        var client = await GetClientAsync();
        var page = new PaginationInfo(0, 50, false);

        var roles = await client.Organizations.GetAllMemberRolesAsync(organization, userId, page);

        return roles.Select(r => r.Id);
    }

    public async Task AddUserOrganizationalRolesAsync(string organization, string userId, List<string> roles)
    {
        var client = await GetClientAsync();

        await client.Organizations.AddMemberRolesAsync(organization, userId, new OrganizationAddMemberRolesRequest { Roles = roles });
    }

    public async Task RemoveUserOrganizationalRolesAsync(string organization, string userId, List<string> roles)
    {
        var client = await GetClientAsync();

        await client.Organizations.DeleteMemberRolesAsync(organization, userId, new OrganizationDeleteMemberRolesRequest { Roles = roles });
    }

    public Task RemoveUserFromOrganizationAsync(string organization, string user) => RemoveUserFromOrganizationAsync(organization, new string[] { user });

    public async Task RemoveUserFromOrganizationAsync(string organization, string[] users)
    {
        var client = await GetClientAsync();

        await client.Organizations.DeleteMemberAsync(organization, new OrganizationDeleteMembersRequest { Members = users });
    }

    public class UserId
    {
        public string user_id { get; set; }
    }

    public class MemberIds
    {
        public UserId[] members { get; set; }
        public string next { get; set; }
    }
}
