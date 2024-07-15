CREATE TABLE [dbo].[LibraryEntryVersionResources] (
    [Id] nvarchar(100) NOT NULL,
    [EntryId] nvarchar(100) NOT NULL,
    [EntryVersion] int NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [CreatedOn] DateTimeOffset NOT NULL,
    [LastModified] DateTimeOffset NOT NULL,
    [Resource] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NULL,
    [Visibility] nvarchar(50) NOT NULL,
    CONSTRAINT [LibraryEntryVersionResources_PK] PRIMARY KEY CLUSTERED ([EntryId] ASC, [EntryVersion] ASC, [Id] ASC),
    CONSTRAINT [LibraryEntryVersionResources_FK_EntryVersion] FOREIGN KEY ([EntryId], [EntryVersion]) REFERENCES [dbo].[LibraryEntryVersions] ([EntryId], [Version]) ON DELETE CASCADE
)
GO

