using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Wbs.Core.Configuration;

namespace Wbs.Core.DataServices;

public class DataServiceFactory
{
    private readonly IDatabaseConfig dbConfig;

    public DataServiceFactory(ILoggerFactory loggerFactory, IDatabaseConfig dbConfig, IAuth0Config auth0Config, IStorageConfig storageConfig)
    {
        this.dbConfig = dbConfig;

        Storage = new Storage(loggerFactory, storageConfig);

        Activities = new ActivityDataService(loggerFactory);
        Chats = new ChatDataService();
        Checklists = new ChecklistDataService();
        ContentResources = new ContentResourceDataService();
        ContentResourceStorage = new ContentResourceStorageService(Storage);
        Invites = new InviteDataService();
        LibraryEntries = new LibraryEntryDataService();
        LibraryVersions = new LibraryEntryVersionDataService();
        LibraryNodes = new LibraryEntryNodeDataService();
        LibraryViews = new LibraryEntryViewDataService();
        Lists = new ListDataService();
        Organizations = new OrganizationDataService();
        OrganizationRoles = new OrganizationRolesDataService();
        Projects = new ProjectDataService();
        ProjectNodes = new ProjectNodeDataService();
        ProjectApprovals = new ProjectApprovalDataService();
        Resources = new ResourcesDataService();
        ProjectSnapshots = new ProjectSnapshotDataService(Projects, ProjectNodes);
        Users = new UserDataService(loggerFactory, auth0Config);
        WatcherLibraryEntries = new WatcherLibraryEntryDataService();
    }

    public ActivityDataService Activities { get; private set; }
    public ChatDataService Chats { get; private set; }
    public ChecklistDataService Checklists { get; private set; }
    public ContentResourceDataService ContentResources { get; private set; }
    public ContentResourceStorageService ContentResourceStorage { get; private set; }
    public InviteDataService Invites { get; private set; }
    public LibraryEntryDataService LibraryEntries { get; private set; }
    public LibraryEntryVersionDataService LibraryVersions { get; private set; }
    public LibraryEntryNodeDataService LibraryNodes { get; private set; }
    public LibraryEntryViewDataService LibraryViews { get; private set; }
    public ListDataService Lists { get; private set; }
    public OrganizationDataService Organizations { get; private set; }
    public OrganizationRolesDataService OrganizationRoles { get; private set; }
    public ProjectDataService Projects { get; private set; }
    public ProjectNodeDataService ProjectNodes { get; private set; }
    public ProjectSnapshotDataService ProjectSnapshots { get; private set; }
    public ProjectApprovalDataService ProjectApprovals { get; private set; }
    public ResourcesDataService Resources { get; private set; }
    public Storage Storage { get; private set; }
    public UserDataService Users { get; private set; }
    public WatcherLibraryEntryDataService WatcherLibraryEntries { get; private set; }


    public async Task<SqlConnection> CreateConnectionAsync()
    {
        var conn = new SqlConnection(dbConfig.SqlConnectionString);

        await conn.OpenAsync();

        return conn;
    }
}