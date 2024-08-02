using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Wbs.Core.DataServices;
using Wbs.Core.Services.Search;

namespace functions
{
    public class UserIndexQueue
    {
        private readonly ILogger _logger;
        private readonly UserDataService userDataService;
        private readonly OrganizationDataService organizationDataService;
        private readonly UserOrganizationIndexService searchIndexService;

        public UserIndexQueue(ILoggerFactory loggerFactory, UserOrganizationIndexService searchIndexService, OrganizationDataService organizationDataService, UserDataService userDataService)
        {
            _logger = loggerFactory.CreateLogger<LibraryIndexQueue>();
            this.searchIndexService = searchIndexService;
            this.organizationDataService = organizationDataService;
            this.userDataService = userDataService;
        }

        [Function("UserIndex-Build")]
        public async Task RunBuild([QueueTrigger("search-user-build", Connection = "")] string message)
        {
            try
            {
                await searchIndexService.VerifyIndexAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new user index");
                throw;
            }
        }

        [Function("UserIndex-Owner")]
        public async Task RunOrg([QueueTrigger("search-user-organization", Connection = "")] string organizationName)
        {
            try
            {
                await searchIndexService.VerifyIndexAsync();

                var docs = await searchIndexService.BuildDocsAsync(organizationName);

                await searchIndexService.PushAsync(docs);
                //
                //  Now rebuild Cloudflare KV
                //
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding users for " + organizationName);
                throw;
            }
        }


        /* t[Function("UserIndex-Clean")]
       public async Task RunClean([QueueTrigger("search-user-clean", Connection = "")] string owner)
       {
           throw new NotImplementedException("Maybe one day");
          ry
            {
                using (var conn = await db.CreateConnectionAsync())
                {
                    await searchIndexService.VerifyIndexAsync();

                    var entries = await dataService.GetByOwnerAsync(conn, owner);
                    var search = await searchSearch.GetAllAsync(owner);
                    var toRemove = search
                        .Where(d => !entries.Any(e => e.EntryId == d.EntryId && e.Version == d.Version))
                        .ToList();

                    if (toRemove.Count > 0)
                        await searchIndexService.RemoveAsync(toRemove);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing all library entries by owner " + owner);
                throw;
            }
       }*/
    }
}
