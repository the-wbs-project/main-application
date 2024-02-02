DROP VIEW IF EXISTS [dbo].[LibraryEntryView]
GO

CREATE VIEW [dbo].[LibraryEntryView]
AS
    SELECT
        e.[OwnerId],
        e.[Id] EntryId,
        v.[Version],
        e.[Author],
        v.[Title],
        v.[Description],
        v.[LastModified],
        v.[Status],
        e.[Type],
        e.[Visibility]
    FROM
        [dbo].[LibraryEntries] e INNER JOIN
        [dbo].[LibraryEntryVersions] v ON e.[Id] = v.[EntryId] AND v.[Version] = ISNULL(e.[PublishedVersion], 1)
GO
