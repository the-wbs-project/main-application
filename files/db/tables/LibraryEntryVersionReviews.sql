CREATE TABLE [dbo].[LibraryEntryVersionReview] (
    [Id] nvarchar(100) NOT NULL,
    [Owner] nvarchar(100) NOT NULL,
    [EntryId] nvarchar(100) NOT NULL,
    [EntryVersion] int NOT NULL,
    [Author] nvarchar(100) NOT NULL,
    [CreatedOn] DateTimeOffset NOT NULL,
    [LastModified] DateTimeOffset NOT NULL,
    [Anonymous] bit NOT NULL,
    [Rating] int NOT NULL,
    [Comment] nvarchar(MAX) NULL,
    [Response] nvarchar(MAX) NULL,
    CONSTRAINT [LibraryEntryVersionReview_PK] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [LibraryEntryVersionReview_UQ] UNIQUE ([Owner], [EntryId], [EntryVersion], [Author]),
    CONSTRAINT [LibraryEntryVersionReview_FK_EntryVersion] FOREIGN KEY ([EntryId], [EntryVersion]) REFERENCES [dbo].[LibraryEntryVersions] ([EntryId], [Version]) ON DELETE CASCADE
)
GO

