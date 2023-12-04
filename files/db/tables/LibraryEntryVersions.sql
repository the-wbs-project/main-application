CREATE TABLE [dbo].[LibraryEntryVersions] (
    [EntryId] nvarchar(100) NOT NULL,
    [Version] int NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [Categories] nvarchar(MAX) NULL,
    [Phases] nvarchar(MAX) NULL,
    [Disciplines] nvarchar(MAX) NULL,
    CONSTRAINT [LibraryEntryVersions_PK] PRIMARY KEY CLUSTERED ([EntryId] ASC, [Version] ASC),
    CONSTRAINT [LibraryEntryVersions_EntryId] FOREIGN KEY ([EntryId]) REFERENCES [dbo].[LibraryEntries] ([Id]) ON DELETE CASCADE
)
GO
