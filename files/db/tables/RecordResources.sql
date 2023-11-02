CREATE TABLE [dbo].[RecordResources] (
    [Id] nvarchar(100) NOT NULL,
    [OwnerId] nvarchar(100) NOT NULL,
    [RecordId] nvarchar(100) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [CreatedOn] DateTimeOffset NOT NULL,
    [LastModified] DateTimeOffset NOT NULL,
    [Resource] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NULL,
    CONSTRAINT RecordResources_PK PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

