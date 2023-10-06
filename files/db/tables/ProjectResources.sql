CREATE TABLE [dbo].[ProjectResources] (
    [Id] nvarchar(100) NOT NULL,
    [ProjectId] nvarchar(100) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [Resource] nvarchar(MAX) NOT NULL,
    [Description] nvarchar(MAX) NOT NULL,
    CONSTRAINT ProjectResources_PK PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT ProjectResources_FK_ProjectId FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
)
GO

