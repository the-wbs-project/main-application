CREATE TABLE [dbo].[LibraryEntryNodes] (
    [Id] nvarchar(100) NOT NULL,
    [EntryId] nvarchar(100) NOT NULL,
    [EntryVersion] int NOT NULL,
    [ParentId] nvarchar(100) NULL,
    [PhaseIdAssociation] nvarchar(100) NULL,
    [Order] int NOT NULL,
    [CreatedOn] datetimeoffset NOT NULL,
    [LastModified] datetimeoffset NOT NULL,
    [Title] nvarchar(MAX) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [Removed] bit NOT NULL,
    [DisciplineIds] nvarchar(MAX) NULL,
    [LibraryLink] nvarchar(MAX) NULL,
    CONSTRAINT [LibraryEntryNodes_PK] PRIMARY KEY CLUSTERED ([EntryId] ASC, [EntryVersion] ASC, [Id] ASC),
    CONSTRAINT [LibraryEntryNodes_FK_EntryVersion] FOREIGN KEY ([EntryId], [EntryVersion]) REFERENCES [dbo].[LibraryEntryVersions] ([EntryId], [Version]) ON DELETE CASCADE
)
GO

