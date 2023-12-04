CREATE TABLE [dbo].[LibraryEntries] (
    [Id] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [PublishedVersion] int NULL,
    [CreatedBy] nvarchar(100) NOT NULL,
    [CreatedOn] datetimeoffset NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [LastModified] datetimeoffset NOT NULL,
    [Visibility] int NULL,
    CONSTRAINT [LibraryEntries_PK] PRIMARY KEY CLUSTERED ([Id] ASC),
    INDEX [LibraryEntries_INDX_OwnerId] NONCLUSTERED ([OwnerId] ASC)
)
GO
