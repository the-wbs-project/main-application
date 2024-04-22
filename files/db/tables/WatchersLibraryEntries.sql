CREATE TABLE [dbo].[WatchersLibraryEntries] (
    [WatcherId] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [EntryId] nvarchar(100) NOT NULL,
    CONSTRAINT [LibraryEntryWatchers_PK] PRIMARY KEY CLUSTERED ([WatcherId] ASC, [OwnerId] ASC, [EntryId] ASC),
    CONSTRAINT [LibraryEntryWatchers_EntryId] FOREIGN KEY ([EntryId]) REFERENCES [dbo].[LibraryEntries] ([Id]) ON DELETE CASCADE
)
GO
