CREATE TABLE [dbo].[LibraryEntryVersions]
(
    [EntryId] nvarchar(100) NOT NULL,
    [Version] int NOT NULL,
    [VersionAlias] nvarchar(200) NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [Status] nvarchar(50) NOT NULL,
    [Categories] nvarchar(MAX) NULL,
    [Phases] nvarchar(MAX) NULL,
    [Disciplines] nvarchar(MAX) NULL,
    [LastModified] datetimeoffset NOT NULL,
    [Author] nvarchar(100) NOT NULL,
    [Editors] nvarchar(MAX) NULL,
    [ReleaseNotes] nvarchar(MAX) NULL,
    CONSTRAINT [LibraryEntryVersions_PK] PRIMARY KEY CLUSTERED ([EntryId] ASC, [Version] ASC),
    CONSTRAINT [LibraryEntryVersions_EntryId] FOREIGN KEY ([EntryId]) REFERENCES [dbo].[LibraryEntries] ([Id]) ON DELETE CASCADE
)
GO
