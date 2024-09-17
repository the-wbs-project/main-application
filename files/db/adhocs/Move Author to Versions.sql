ALTER TABLE [dbo].[LibraryEntryVersions] ADD    [Author] nvarchar(100) NULL
GO
ALTER TABLE [dbo].[LibraryEntryVersions] ADD    [Editors] nvarchar(MAX) NULL
GO

UPDATE dbo.LibraryEntryVersions
SET [Author] = e.[Author]
FROM dbo.LibraryEntryVersions v INNER JOIN dbo.LibraryEntries e ON v.EntryId = e.Id
GO

ALTER TABLE [dbo].[LibraryEntryVersions] ALTER COLUMN [Author] nvarchar(100) NOT NULL
GO

ALTER TABLE [dbo].[LibraryEntries] DROP COLUMN [Author]
GO

ALTER TABLE [dbo].[LibraryEntries] DROP COLUMN [Editors]
GO