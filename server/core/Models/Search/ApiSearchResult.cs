using Azure.Search.Documents.Models;

namespace Wbs.Core.Models.Search;

public class ApiSearchResult<T>
{
    public ApiSearchResult() { }
    public ApiSearchResult(SearchResult<T> result)
    {
        Document = result.Document;
        Highlights = result.Highlights;
        Score = result.Score;
        SemanticSearch = result.SemanticSearch;
    }

    public double? Score { get; set; }
    public IDictionary<string, IList<string>> Highlights { get; set; }
    public SemanticSearchResult SemanticSearch { get; set; }
    public T Document { get; set; }
}