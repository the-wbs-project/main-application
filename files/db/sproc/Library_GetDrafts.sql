DROP PROCEDURE IF EXISTS [dbo].[Library_GetDrafts]
GO

CREATE PROCEDURE [dbo].[Library_GetDrafts]
    @OwnerId nvarchar(100),
    @UserId nvarchar(100),
    @Types nvarchar(MAX)
AS
BEGIN
    SELECT [value]
    INTO #Types
    FROM string_split(@Types, ',')

    SELECT
        e.[Id],
        e.[Type],
        e.[OwnerId],
        v.[Author],
        v.[Version],
        v.[VersionAlias],
        v.[Title],
        v.[LastModified],
        e.[Visibility]
    FROM
        [dbo].[LibraryEntries] e LEFT JOIN
        [dbo].[LibraryEntryVersions] v ON e.[Id] = v.[EntryId]
    WHERE
        e.[OwnerId] = @OwnerId AND
        (v.[Author] = @UserId OR v.[Editors] LIKE '%' + @UserId + '%') AND
        v.[Status] = 'draft' AND
        CASE
            WHEN ISNULL(@Types, '') = 'all' THEN 1
            WHEN e.[Type] IN (SELECT [value]
        FROM #Types) THEN 1
            ELSE 0
        END = 1

    DROP TABLE #Types
END
GO
