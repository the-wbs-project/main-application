DROP PROCEDURE IF EXISTS [dbo].[LibraryEntryVersionEditors_Set]
GO

CREATE PROCEDURE [dbo].[LibraryEntryVersionEditors_Set]
    @EntryId NVARCHAR(100),
    @Version INT,
    @Editors NVARCHAR(MAX)
-- JSON string array
AS
BEGIN
    -- Parse the JSON array into a temporary table
    SELECT [value] AS EditorId
    INTO #EditorsTable
    FROM OPENJSON(@Editors)

    -- Merge insert and delete operations
    MERGE [dbo].[LibraryEntryVersionEditors] AS target
    USING #EditorsTable AS source
        ON target.[EntryId] = @EntryId
        AND target.[Version] = @Version
        AND target.[EditorId] = source.EditorId
    WHEN NOT MATCHED BY TARGET THEN
        INSERT ([EntryId], [Version], [EditorId])
        VALUES (@EntryId, @Version, source.EditorId)
    WHEN NOT MATCHED BY SOURCE AND target.[EntryId] = @EntryId AND target.[Version] = @Version THEN
        DELETE;

    DROP TABLE #EditorsTable
END
GO