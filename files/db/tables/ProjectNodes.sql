CREATE TABLE [dbo].[ProjectNodes] (
    [Id] nvarchar(100) NOT NULL,
    [ProjectId] nvarchar(100) NOT NULL,
    [ParentId] nvarchar(100) NULL,
    [Order] int NOT NULL,
    [CreatedOn] datetimeoffset NOT NULL,
    [LastModified] datetimeoffset NOT NULL,
    [Title] nvarchar(MAX) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [Removed] bit NOT NULL,
    [DisciplineIds] nvarchar(MAX) NULL,
    [PhaseIdAssociation] nvarchar(100) NULL,
    CONSTRAINT ProjectNodes_PK PRIMARY KEY CLUSTERED ([ProjectId] ASC, [Id] ASC),
    CONSTRAINT ProjectNode_FK_ProjectId FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
)
GO

