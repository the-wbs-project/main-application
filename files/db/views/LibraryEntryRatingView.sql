DROP VIEW IF EXISTS [dbo].[LibraryEntryRatingView]
GO

CREATE VIEW [dbo].[LibraryEntryRatingView]
AS
    SELECT
        e.[OwnerId],
        e.[Id] EntryId,
        v.[Version] EntryVersion,
        2.5 [Rating]
    FROM
        [dbo].[LibraryEntries] e INNER JOIN
        [dbo].[LibraryEntryVersions] v ON e.[Id] = v.[EntryId] AND v.[Version] = ISNULL(e.[PublishedVersion], 1)
GO
