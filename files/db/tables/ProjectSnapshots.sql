CREATE TABLE [dbo].[ProjectSnapshots] (
    [ActivityId] nvarchar(100) NOT NULL,
    [ProjectId] nvarchar(100) NOT NULL,
    [Timestamp] datetimeoffset NOT NULL,
    [Project] nvarchar(MAX) NOT NULL,
    [Nodes] nvarchar(MAX) NOT NULL,
    CONSTRAINT ProjectSnapshots_PK PRIMARY KEY CLUSTERED ([ActivityId] ASC),
    CONSTRAINT ProjectSnapshots_FK_ActivityId FOREIGN KEY ([ActivityId]) REFERENCES [dbo].[Activities] ([Id]) ON DELETE CASCADE,
    CONSTRAINT ProjectSnapshots_FK_ProjectId FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[Projects] ([Id]) ON DELETE CASCADE
)
GO

