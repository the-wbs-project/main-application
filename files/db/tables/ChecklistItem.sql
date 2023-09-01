CREATE TABLE [dbo].[ChecklistItems] (
    [GroupId] nvarchar(100) NOT NULL,
    [Id] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [Description] nvarchar(255) NOT NULL,
    [Type] nvarchar(100) NOT NULL,
    [Path] nvarchar(MAX) NULL,
    [Pass] nvarchar(MAX) NULL,
    [Warn] nvarchar(MAX) NULL,
    CONSTRAINT [ChecklistItems_PK] PRIMARY KEY CLUSTERED ([GroupId] ASC, [Id] ASC),
    CONSTRAINT [ChecklistItems_FK_GroupId] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[ChecklistGroups] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [ChecklistItems_UQ] UNIQUE ([GroupId] ASC, [Order] ASC)
)
GO

