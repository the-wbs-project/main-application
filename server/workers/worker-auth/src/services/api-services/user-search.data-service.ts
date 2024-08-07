import { AzureKeyCredential, SearchClient, SearchIndex, SearchIndexClient, SearchIndexerClient } from '@azure/search-documents';
import { Env } from '../../config';
import { UserSearchDocument } from '../../models';
import * as USER_INDEX from '../../user-index.json';
import { UserTransformer } from '../transformers';

export class UserSearchDataService {
  private readonly searchClient: SearchClient<UserSearchDocument>;
  private readonly indexClient: SearchIndexClient;
  private readonly indexerClient: SearchIndexerClient;

  constructor(env: Env) {
    this.searchClient = new SearchClient(env.SEARCH_ENDPOINT, env.SEARCH_INDEX_NAME, new AzureKeyCredential(env.SEARCH_API_KEY));

    this.indexClient = new SearchIndexClient(env.SEARCH_ENDPOINT, new AzureKeyCredential(env.SEARCH_API_KEY));
    this.indexerClient = new SearchIndexerClient(env.SEARCH_ENDPOINT, new AzureKeyCredential(env.SEARCH_API_KEY));
  }

  async verifyIndex(): Promise<void> {
    console.log('Verifying Search Index');

    try {
      const index = await this.indexClient.getIndex(this.searchClient.indexName);
    } catch (e) {
      const result = await this.indexClient.createIndex(USER_INDEX as SearchIndex);
    }
  }

  async getUserAsync(organizationName: string, userId: string, visibility: string): Promise<UserSearchDocument> {
    const docId = UserTransformer.getDocumentId(organizationName, userId, visibility);

    return await this.searchClient.getDocument(docId);
  }

  async uploadAsync(docs: UserSearchDocument[]): Promise<void> {
    await this.searchClient.uploadDocuments(docs);
  }

  async deleteAsync(docs: UserSearchDocument[]): Promise<void> {
    await this.searchClient.deleteDocuments(docs);
  }
}
/* 
  searchClient: To query and manipulate documents
  indexClient: To manage indexes and synonymmaps
  indexerClient: To manage indexers, datasources and skillsets
*/
