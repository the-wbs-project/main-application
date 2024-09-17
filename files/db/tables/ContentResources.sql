CREATE TABLE [dbo].[ContentResources]
(
    [Id] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [ParentId] nvarchar(100) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [CreatedOn] DateTimeOffset NOT NULL,
    [LastModified] DateTimeOffset NOT NULL,
    [Resource] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NULL,
    [Visibility] nvarchar(50) NULL,
    CONSTRAINT [ContentResources_PK] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

