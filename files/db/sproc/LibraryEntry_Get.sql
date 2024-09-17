DROP PROCEDURE IF EXISTS [dbo].[LibraryEntry_Get]
GO

CREATE PROCEDURE [dbo].[LibraryEntry_Get]
    @OwnerId nvarchar(100),
    @UserId nvarchar(100),
    @Roles nvarchar(MAX),
    @Types nvarchar(MAX)
AS
BEGIN
    SELECT [value]
    INTO #Roles
    FROM string_split(@Roles, ',')

    SELECT [value]
    INTO #Types
    FROM string_split(@Types, ',')

    SELECT [EntryId]
    INTO #Watches
    FROM [dbo].[WatchersLibraryEntries] w
    WHERE w.[WatcherId] = @UserId AND w.[OwnerId] = @OwnerId

    SELECT *
    FROM [dbo].[LibraryEntryView] v
    WHERE
        v.[OwnerId] = @OwnerId AND
        v.[Status] = 'published' AND
        CASE
            WHEN ISNULL(@Roles, '') = '' THEN 1
            WHEN 'author' IN (SELECT [value]
            from #Roles) AND [Author] = @UserId THEN 1
            WHEN 'watching' IN (SELECT [value]
            from #Roles) AND v.[EntryId] IN (SELECT [EntryId]
            FROM #Watches) THEN 1
            ELSE 0
        END = 1 AND
        CASE
            WHEN ISNULL(@Types, '') = '' THEN 1
            WHEN v.[Type] IN (SELECT [value]
        FROM #Types) THEN 1
            ELSE 0
        END = 1

    DROP TABLE #Roles
    DROP TABLE #Types
    DROP TABLE #Watches
END
GO
