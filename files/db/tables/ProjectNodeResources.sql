CREATE TABLE [dbo].[ProjectNodeResources]
(
    [Id] nvarchar(100) NOT NULL,
    [ProjectId] nvarchar(100) NOT NULL,
    [NodeId] nvarchar(100) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [CreatedOn] DateTimeOffset NOT NULL,
    [LastModified] DateTimeOffset NOT NULL,
    [Resource] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NULL,
    [Visibility] nvarchar(50) NOT NULL,
    CONSTRAINT [ProjectNodeResources_PK] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [ProjectNodeResources_FK_ProjectNode] FOREIGN KEY ([ProjectId], [NodeId]) REFERENCES [dbo].[ProjectNodes] ([ProjectId], [Id]) ON DELETE CASCADE
)
GO

