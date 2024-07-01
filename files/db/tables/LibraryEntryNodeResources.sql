CREATE TABLE [dbo].[LibraryEntryNodeResources] (
    [Id] nvarchar(100) NOT NULL,
    [EntryId] nvarchar(100) NOT NULL,
    [EntryVersion] int NOT NULL,
    [EntryNodeId] nvarchar(100) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [CreatedOn] DateTimeOffset NOT NULL,
    [LastModified] DateTimeOffset NOT NULL,
    [Resource] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NULL,
    [Visibility] nvarchar(50) NOT NULL,
    CONSTRAINT [LibraryEntryNodeResources_PK] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [LibraryEntryNodeResources_FK_EntryNode] FOREIGN KEY ([EntryId], [EntryVersion], [EntryNodeId]) REFERENCES [dbo].[LibraryEntryNodes] ([EntryId], [EntryVersion], [Id]) ON DELETE CASCADE
)
GO

