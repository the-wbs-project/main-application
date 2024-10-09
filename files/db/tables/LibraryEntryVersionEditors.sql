CREATE TABLE [dbo].[LibraryEntryVersionEditors]
(
    [EntryId] NVARCHAR(100) NOT NULL,
    [Version] INT NOT NULL,
    [UserId] NVARCHAR(100) NOT NULL,
    CONSTRAINT [LibraryEntryVersionEditors_PK] PRIMARY KEY CLUSTERED ([EntryId] ASC, [Version] ASC, [UserId] ASC),
    CONSTRAINT [LibraryEntryVersionEditors_FK_EntryId] FOREIGN KEY ([EntryId], [Version]) REFERENCES [dbo].[LibraryEntryVersions]([EntryId], [Version]) ON DELETE CASCADE
);
