CREATE TABLE [dbo].[LibraryEntries] (
    [Id] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [PublishedVersion] int NULL,
    [Type] nvarchar(50) NOT NULL,
    [Author] nvarchar(100) NOT NULL,
    [Visibility] nvarchar(50) NOT NULL,
    [Editors] nvarchar(MAX) NULL,
    CONSTRAINT [LibraryEntries_PK] PRIMARY KEY CLUSTERED ([Id] ASC),
    INDEX [LibraryEntries_INDX_OwnerId] NONCLUSTERED ([OwnerId] ASC)
)
GO
