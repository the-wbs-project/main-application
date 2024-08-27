DROP VIEW IF EXISTS [dbo].[LibraryEntryView]
GO

CREATE VIEW [dbo].[LibraryEntryView]
AS
    SELECT
        e.[OwnerId],
        e.[Id] EntryId,
        e.[RecordId],
        e.[Type],
        e.[Visibility],
        v.[Version],
        v.[Author],
        v.[Title],
        v.[VersionAlias],
        v.[LastModified],
        v.[Status]
    FROM
        [dbo].[LibraryEntries] e INNER JOIN
        [dbo].[LibraryEntryVersions] v ON e.[Id] = v.[EntryId] AND v.[Version] = ISNULL(e.[PublishedVersion], 1)
GO
